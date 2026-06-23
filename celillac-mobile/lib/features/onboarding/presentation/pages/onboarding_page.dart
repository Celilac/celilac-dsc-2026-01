import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OnboardingPage extends StatelessWidget {
  final VoidCallback onGetStarted;
  final VoidCallback onLogin;

  const OnboardingPage({
    super.key,
    required this.onGetStarted,
    required this.onLogin,
  });

  @override
  Widget build(BuildContext context) {
    // Custom colors extracted from the Stitch Tailwind config
    const backgroundColor = Color(0xFF11131C);
    const primaryContainerColor = Color(0xFF2D5BFF);
    const primaryColor = Color(0xFFB8C3FF);
    const onSurfaceColor = Color(0xFFE2E1EF);
    const onSurfaceVariantColor = Color(0xFFC4C5D9);
    const secondaryContainerColor = Color(0xFF00EEFC);
    const surfaceVariantColor = Color(0xFF33343E);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Stack(
        children: [
          // Ambient Glow
          Positioned(
            top: -MediaQuery.of(context).size.width * 0.5,
            left: -MediaQuery.of(context).size.width * 0.25,
            child: Container(
              width: MediaQuery.of(context).size.width * 1.5,
              height: MediaQuery.of(context).size.width * 1.5,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFF2D5BFF).withOpacity(0.15),
                    const Color(0xFF11131C).withOpacity(0.0),
                  ],
                  stops: const [0.0, 0.7],
                ),
              ),
            ),
          ),

          // Main content
          SafeArea(
            bottom: false,
            child: Column(
              children: [
                const SizedBox(height: 24),

                // Image / Illustration Area
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Center(
                      child: Container(
                        constraints: const BoxConstraints(
                          maxWidth: 384,
                          minHeight: 353,
                        ),
                        child: AspectRatio(
                          aspectRatio: 1.0,
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.white.withOpacity(0.1),
                              ),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x99000000), // 0.6 opacity
                                  blurRadius: 40,
                                  offset: Offset(0, 20),
                                ),
                              ],
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: Image.network(
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuDHpvtvLeX2oEww-Duo6VHuJ9sZXErVEcvQwm2lv3sr4r0qjJO8PWPfoNV2MwILlukUNEHjEfcSgqwtOt1CFndT6jyhsfLllEp0H0ynvT17GvVETrf9PEz1LbH6DqBPyadDkXShg8yrRcaVSoAAR2c5A3Jerj8vMJyN64XOG6GRP-igHwSjAZIEbfR58uRZe92uNCB888oy2onzcnU_cPDo-T-FSN3oFFC2tkhPlntUsQkKmu3M1fXg0fFzz5b2C5jl1O49_vu8f28D',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(color: surfaceVariantColor);
                              },
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),

                // Bottom Content Sheet (Glassmorphism)
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(32),
                  ),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFF191B24).withOpacity(0.6),
                        border: Border(
                          top: BorderSide(color: Colors.white.withOpacity(0.1)),
                          left: BorderSide(
                            color: Colors.white.withOpacity(0.1),
                          ),
                          right: BorderSide(
                            color: Colors.white.withOpacity(0.1),
                          ),
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x66000000),
                            blurRadius: 20,
                            offset: Offset(0, -4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.only(
                        top: 32,
                        bottom: 40,
                        left: 16,
                        right: 16,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Brand
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.local_shipping,
                                color: primaryContainerColor,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'CeliLac',
                                style: GoogleFonts.inter(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w600,
                                  color: primaryColor,
                                  letterSpacing: -0.24,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          // Copy
                          SizedBox(
                            width: double.infinity,
                            // max width handled by layout, assuming mobile width
                            child: Column(
                              children: [
                                Text(
                                  'Gestão Inteligente de Pedidos Corporativos',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(
                                    fontSize: 32,
                                    fontWeight: FontWeight.w600,
                                    height: 1.25, // 40px / 32px
                                    color: onSurfaceColor,
                                    letterSpacing: -0.32,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Acompanhe seus pedidos B2B em tempo real com agilidade e segurança total.',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w400,
                                    height: 1.5, // 24px / 16px
                                    color: onSurfaceVariantColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 32),

                          // Pagination Dots
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 32,
                                height: 6,
                                decoration: BoxDecoration(
                                  color: secondaryContainerColor,
                                  borderRadius: BorderRadius.circular(3),
                                  boxShadow: [
                                    BoxShadow(
                                      color: secondaryContainerColor
                                          .withOpacity(0.4),
                                      blurRadius: 8,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                width: 6,
                                height: 6,
                                decoration: BoxDecoration(
                                  color: surfaceVariantColor,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                width: 6,
                                height: 6,
                                decoration: BoxDecoration(
                                  color: surfaceVariantColor,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),

                          // Actions
                          SizedBox(
                            width: double.infinity,
                            child: Column(
                              children: [
                                ElevatedButton(
                                  onPressed: onGetStarted,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryContainerColor,
                                    foregroundColor: Colors.white,
                                    minimumSize: const Size.fromHeight(44),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    elevation: 0,
                                    shadowColor: const Color(0x402D5BFF),
                                  ),
                                  child: Text(
                                    'Get Started',
                                    style: GoogleFonts.inter(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                OutlinedButton(
                                  onPressed: onLogin,
                                  style: OutlinedButton.styleFrom(
                                    backgroundColor: backgroundColor
                                        .withOpacity(0.5),
                                    foregroundColor: onSurfaceColor,
                                    minimumSize: const Size.fromHeight(44),
                                    side: BorderSide(
                                      color: Colors.white.withOpacity(0.1),
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: Text(
                                    'Log In',
                                    style: GoogleFonts.inter(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
