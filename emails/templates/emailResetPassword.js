 const emailResetPassword = ({ name, token }) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Restablecer contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F4F8;font-family:'Arial',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F8;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card principal -->
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header con gradiente primario -->
          <tr>
            <td align="center"
              style="background:linear-gradient(135deg,#1A73E8 0%,#0D47A1 100%);padding:36px 40px 28px;">
              
              <!-- Ícono tienda -->
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);
                border-radius:14px;margin:0 auto 16px;display:flex;
                align-items:center;justify-content:center;
                border:2px solid rgba(255,255,255,0.3);">
                <span style="font-size:28px;line-height:56px;display:block;text-align:center;">🏪</span>
              </div>

              <h1 style="margin:0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                MercadoBarrio
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:400;
                letter-spacing:0.5px;">
                Tu mercado local en un click
              </p>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding:36px 40px 0;">

              <!-- Título sección -->
              <h2 style="margin:0 0 8px;color:#1A202C;font-size:20px;font-weight:700;">
                Restablecer contraseña
              </h2>
              <p style="margin:0 0 24px;color:#718096;font-size:14px;line-height:1.6;">
                Hola <strong style="color:#1A202C;">${name}</strong>, recibimos una solicitud para
                cambiar la contraseña de tu cuenta.
              </p>

              <!-- Alerta informativa -->
              <div style="background:#EBF8FF;border-left:4px solid #1A73E8;border-radius:0 10px 10px 0;
                padding:14px 16px;margin-bottom:28px;">
                <p style="margin:0;color:#2B6CB0;font-size:13px;line-height:1.5;">
                  🔒 Este enlace es de <strong>uso único</strong> y expirará en
                  <strong>30 minutos</strong> por tu seguridad.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${process.env.FRONTEND_URL}/change-password/${token}"
                  style="display:inline-block;background:linear-gradient(135deg,#1A73E8,#0D47A1);
                  color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:700;
                  padding:14px 36px;border-radius:50px;
                  box-shadow:0 4px 14px rgba(26,115,232,0.4);
                  letter-spacing:0.3px;">
                  Cambiar Contraseña
                </a>
              </div>

              <!-- Link alternativo -->
              <p style="margin:0 0 28px;color:#A0AEC0;font-size:12px;text-align:center;line-height:1.6;">
                ¿El botón no funciona? Copia este enlace en tu navegador:<br/>
                <a href="${process.env.FRONTEND_URL}/change-password/${token}"
                  style="color:#1A73E8;word-break:break-all;font-size:11px;">
                  ${process.env.FRONTEND_URL}/change-password/${token}
                </a>
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #EDF2F7;margin:0;"/>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;">
              <p style="margin:0;color:#A0AEC0;font-size:12px;line-height:1.6;text-align:center;">
                Si no solicitaste este cambio, puedes ignorar este mensaje.<br/>
                Tu contraseña actual permanecerá sin cambios.
              </p>
              <p style="margin:16px 0 0;color:#CBD5E0;font-size:11px;text-align:center;">
                © 2026 MercadoBarrio · Cartago, Valle del Cauca
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

export default emailResetPassword;
