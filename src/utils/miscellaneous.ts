export const findGCD = (num1:number,num2:number) => {
    const g = Math.max(num1,num2)
    const l = Math.min(num1,num2)
    console.log(g,l);
    function gcd (a:number,b:number) {
        if (b===0) {
            return a
        } else {
            return gcd (b,a%b)
        }
    }
    return gcd(g,l)
}

export const findAspectRatio = (width:number|undefined,height:number|undefined) => {
    if (!width||!height) {
        return {w_part:0,h_part:0}
    }
    const gcdOfWidthAndHeight = width===height ? 1 : findGCD(width,height) || 0
    return {w_part:(width/gcdOfWidthAndHeight) ,h_part:(height/gcdOfWidthAndHeight) } 
}   