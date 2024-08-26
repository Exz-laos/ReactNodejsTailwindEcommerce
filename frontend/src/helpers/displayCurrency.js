const displayKIPCurrency = (num) => {
    const formatter = new Intl.NumberFormat('lo-LA',{
        style : "currency",
        currency : 'LAK',
    })

    return formatter.format(num)

}

export default displayKIPCurrency