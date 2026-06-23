const API_URL = 'http://localhost:3002';

export interface User {
  userId: string;
  name?: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const authService = {
  async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao autenticar. Verifique suas credenciais.');
    }

    const data: LoginResponse = await response.json();
    return data;
  },

  async register(registerData: RegisterData): Promise<User> {
    // We send role: 'user' as default for self-registrations
    const payload = {
      ...registerData,
      role: registerData.role || 'user',
    };

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao registrar usuário.');
    }

    const data: User = await response.json();
    return data;
  },

  async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Simulating API request to recover password
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Instruções de redefinição de senha enviadas com sucesso para o e-mail: ${email}`,
        });
      }, 1000);
    });
  },
};
