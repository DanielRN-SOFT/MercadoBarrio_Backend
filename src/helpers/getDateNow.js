export default function getDateNow() {
  const now = new Date();

  // Obtener componentes de la fecha
  const año = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const dia = String(now.getDate()).padStart(2, "0");

  // Obtener componentes de la hora
  const horas = String(now.getHours()).padStart(2, "0");
  const minutos = String(now.getMinutes()).padStart(2, "0");
  const segundos = String(now.getSeconds()).padStart(2, "0");

  // Unir todo en el formato de MySQL
  return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}
