const bankTokens = {
    1: import.meta.env.VITE_APP_KEYFACIL_INTERBANK_TOKEN,
    2: import.meta.env.VITE_APP_KEYFACIL_BCP_TOKEN,
    3: import.meta.env.VITE_APP_KEYFACIL_SCOTIABANK_TOKEN,
    5: import.meta.env.VITE_APP_KEYFACIL_BBVA_TOKEN
}

const getKeyFacilToken = (id) => {
    return bankTokens[id]
}

export { getKeyFacilToken }
