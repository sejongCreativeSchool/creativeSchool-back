export const filter = async( datas ) => {
    return datas.map( data => {
        switch(data[0]){
            case '센':
                data = '대양AI센터'
                break;
            case '광':
                data = '광개토관'
                break;
            case '학':
                data = '학술정보원'
                break;
            case 'L':
                data = '군자관'
                break;
            case '영':
                data = '영실관'
                break;
            case '충':
                data = '충무관'
                break;
            default : 
                data = '세종대학교'
                break;
        }
        return data;
    });
}