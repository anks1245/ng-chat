
export function displayName(name: string){
    const splitNameArr = name.split(" ");
    if(splitNameArr.length >= 2){
      return splitNameArr[0].charAt(0).toUpperCase()+splitNameArr[1].charAt(0).toUpperCase()
    }else{
      return splitNameArr[0].charAt(0).toUpperCase()
    }
}