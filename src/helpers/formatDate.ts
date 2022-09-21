export function FormatDate(date: string[]){
    //const {year, month, day, hour, minute, second} = betsCreatedAt
    const year = date[3]
    // const month = new Date().getMonth() + 1
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0') 
    const day = date[2] 
    const hour_minute_second = date[4] 

    return {
        year, month, day, hour_minute_second
    }
}