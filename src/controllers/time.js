/**
 * Format the time and date.
 *
 * @param {string} dateString - The datestring from gitlab.
 * @returns {string} - formated date and time.
 */
function getformattedTimeAndDate (dateString) {
  // Skapa ett Date-objekt från strängen
  const date = new Date(dateString)

  // Skapa en Intl.DateTimeFormat-instans för att hämta tidszonen från användarens enhet
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Anropa formateringsfunktionen med aktuell tidszon
  const formattedDateTime = formatDateTimeWithTimeZone(date, timeZone)

  console.log(formattedDateTime)
  return formattedDateTime
}

/**
 * Create a formatingfunction with the timezone.
 *
 * @param {string} date - the date and time string.
 * @param {string} timeZone - timezone.
 * @returns {string} - date and time.
 */
function formatDateTimeWithTimeZone (date, timeZone) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // use 24h format
  })

  return formatter.format(date)
}

export { getformattedTimeAndDate }
