import Book from '../models/Book'
import User from '../models/User'
type hash = () => string;
export const getHashCode = async<hash>(type : string) =>{
    let hash : string = '';
    while(1){
        for (let i=0; i<6; i++){
            const rand : number = Math.floor(Math.random() * 25) + 65;
            const char : string = String.fromCharCode(rand);
            hash += char;
        }
        let isAlready
        if ( type === 'book'){
            isAlready = await Book.findOne({hash: hash});
        }
        else if ( type === 'user'){
            isAlready = await User.findOne({hash: hash});
        }
        if ( isAlready ){
            hash = '';
            continue;
        }
        break;
    }
    return hash
}