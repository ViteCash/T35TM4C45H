export function formatComas(value) {
    if (value) {
        let strsend = value.toString().split('.')
        return strsend[1]
            ? `${strsend[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${
                  strsend[1]
              }`
            : `${strsend[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }
    return ''
}

export function formatDate1(data) {
    let dt = new Date(data)
    let day = dt.getDate()
    let month = dt.getMonth()
    let year = dt.getFullYear()
    return `${year}-${month + 1}-${day}`
}

export function formatDate2(data) {
    let value
    if (typeof data === 'string' && data.includes('-'))
        value = `${data}T00:00:00`
    else value = data
    let dt = new Date(value)
    let day = dt.getDate()
    let month = dt.getMonth()
    let year = dt.getFullYear()
    return `${day}/${month + 1}/${year}`
}
