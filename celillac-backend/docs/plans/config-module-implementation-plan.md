# Módulo de Infraestrutura de Configuração — Celilac Backend

## Objetivo

Criar um módulo de configuração centralizado, tipado e validado em tempo de boot para o backend NestJS, substituindo o padrão atual de strings brutas e variáveis de ambiente acessadas diretamente. A validação será feita via **Zod** (ver análise abaixo).

---

## Análise: Por que Zod em vez de Joi?

O NestJS documenta oficialmente o uso de **Joi** para validação de configuração, mas o **Zod** é superior para projetos TypeScript pelos seguintes motivos:

| Critério | Joi | Zod |
|---|---|---|
| Origem | JavaScript (tipos adicionados depois) | TypeScript-first, criado para TS |
| Tipos automáticos | ❌ Precisa declarar tipos separados | ✅ `z.infer<typeof schema>` |
| Drift tipo/validação | ⚠️ Risco de dessincronia | ✅ Schema = fonte única da verdade |
| Mensagens de erro | Boas | Melhores (estruturadas) |
| Bundle size (server) | Irrelevante | Irrelevante |
| Integração NestJS | Nativa (`validate:`) | Via adaptador simples (`parse()`) |

**Decisão: usar Zod.** A integração com `ConfigModule.forRoot({ validate })` é trivial: basta passar uma função que chama `schema.parse(config)` — o NestJS só exige que a função lance uma exceção em caso de erro, e o Zod faz exatamente isso. O ganho de ter o tipo TypeScript inferido automaticamente do schema elimina toda a duplicação de definições.

> [!IMPORTANT]
> O `.env.example` atual **não possui** `JWT_SECRET` nem `JWT_EXPIRATION`. Ambas as variáveis precisam ser adicionadas antes da execução.

---

## Proposed Changes

### 1. Dependência

#### [MODIFY] [package.json](file:///Users/evertoncoimbradearaujo/Documents/GitHub/celilac-dsc-2026-01/celillac-backend/package.json)

Adicionar `zod` às `dependencies`:
```json
"zod": "^3.23.0"
```

---

### 2. Estrutura de Arquivos

```
src/
  config/
    env.schema.ts          ← [NEW] Schema Zod + tipo inferido do env completo
    database.config.ts     ← [NEW] registerAs('database', ...)
    jwt.config.ts          ← [NEW] registerAs('jwt', ...)
    app.config.ts          ← [NEW] registerAs('app', ...)
    index.ts               ← [NEW] Re-export de todos os configs
```

---

### 3. Arquivos Novos

#### [NEW] `src/config/env.schema.ts`

Schema Zod que valida **todas** as variáveis de ambiente na inicialização. Se alguma obrigatória faltar ou tiver tipo errado, o boot falha com mensagem clara.

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  // App
  PORT: z.coerce.number().default(3002),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres'),
  JWT_EXPIRATION: z.string().default('1d'),
});

export type EnvConfig = z.infer<typeof envSchema>;
```

#### [NEW] `src/config/database.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));
```

#### [NEW] `src/config/jwt.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION ?? '1d',
}));
```

#### [NEW] `src/config/app.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: Number(process.env.PORT ?? 3002),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
}));
```

#### [NEW] `src/config/index.ts`

```typescript
export * from './env.schema';
export * from './database.config';
export * from './jwt.config';
export * from './app.config';
```

---

### 4. Arquivos Modificados

#### [MODIFY] [app.module.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/celilac-dsc-2026-01/celillac-backend/src/app.module.ts)

Adicionar `load` com os configs nomeados e a função `validate` com Zod:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig, jwtConfig, appConfig],
  validate: (config) => envSchema.parse(config),
}),
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => ({
    type: 'postgres',
    host: cs.get('database.host'),
    port: cs.get<number>('database.port'),
    username: cs.get('database.username'),
    password: cs.get('database.password'),
    database: cs.get('database.database'),
    entities: [OrderEntity, PaymentEntity, ProductEntity, UserEntity],
    synchronize: cs.get('app.isProduction') === false,
  }),
}),
```

> [!WARNING]
> `synchronize: true` em produção pode causar perda de dados. O novo config usa `isProduction` para desabilitar isso automaticamente.

#### [MODIFY] [auth.module.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/celilac-dsc-2026-01/celillac-backend/src/modules/auth/auth.module.ts)

Usar namespace `jwt.*` em vez de strings brutas:

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => ({
    secret: cs.get<string>('jwt.secret'),
    signOptions: { expiresIn: cs.get<string>('jwt.expiresIn') },
  }),
}),
```

#### [MODIFY] [jwt.strategy.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/celilac-dsc-2026-01/celillac-backend/src/modules/auth/strategies/jwt.strategy.ts)

Remover fallback hardcoded:

```typescript
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: configService.get<string>('jwt.secret'),
  // ← sem fallback: a validação Zod garante que JWT_SECRET existe
});
```

#### [MODIFY] [main.ts](file:///Users/evertoncoimbradearaujo/Documents/GitHub/celilac-dsc-2026-01/celillac-backend/src/main.ts)

```typescript
// Antes:
const port = process.env.PORT ?? 3002;

// Depois (após app ser criado, injetar ConfigService):
const configService = app.get(ConfigService);
const port = configService.get<number>('app.port');
```

#### [MODIFY] [.env.example](file:///Users/evertoncoimbradearaujo/Documents/GitHub/celilac-dsc-2026-01/celillac-backend/.env.example)

Adicionar as variáveis faltantes:

```dotenv
PORT=3002
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=celillac
DB_PASSWORD=celillac
DB_DATABASE=celillac_db

JWT_SECRET=mude-esta-chave-para-algo-seguro-com-mais-de-32-chars
JWT_EXPIRATION=1d
```

---

## Verification Plan

### Automated
```bash
# Boot sem erros
pnpm start:dev

# Boot com variável faltando (deve falhar com mensagem clara)
JWT_SECRET="" pnpm start:dev
```

### Manual
- [ ] Remover `JWT_SECRET` do `.env` → boot deve falhar com mensagem de erro do Zod
- [ ] `JWT_SECRET` com menos de 32 chars → deve falhar com mensagem `"JWT_SECRET deve ter no mínimo 32 caracteres"`
- [ ] `DB_PORT=abc` → deve falhar com erro de tipo (`coerce.number` converte strings numéricas, mas rejeita texto)
- [ ] Em `NODE_ENV=production` → verificar que `synchronize` é `false` no TypeORM log
- [ ] Fluxo de login e autenticação JWT deve continuar funcionando normalmente
