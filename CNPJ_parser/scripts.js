const newInput = document.getElementById('input');
const CNPJ_valid = document.getElementById('CNPJ_valid')
CNPJ_valid.innerHTML = "NO" // initially input is empty, therefore not valid CNPJ

function validateCNPJ(cnpj){
    const v = [1,2] // initialize v with any values
    cnpj.unshift(0) // indexes of cnpj array start at 1 in this algorithm

    // Calculate the first verification digit
    v[0] = 5*cnpj[1] + 4*cnpj[2]  + 3*cnpj[3]  + 2*cnpj[4]
    v[0] += 9*cnpj[5] + 8*cnpj[6]  + 7*cnpj[7]  + 6*cnpj[8]
    v[0] += 5*cnpj[9] + 4*cnpj[10] + 3*cnpj[11] + 2*cnpj[12]
    v[0] = 11 - (v[0] %  11)
    v[0] = v[0] >= 10? 0 : v[0]

    // Calculate the second verification digit
    v[1] = 6*cnpj[1] + 5*cnpj[2]  + 4*cnpj[3]  + 3*cnpj[4]
    v[1] += 2*cnpj[5] + 9*cnpj[6]  + 8*cnpj[7]  + 7*cnpj[8]
    v[1] += 6*cnpj[9] + 5*cnpj[10] + 4*cnpj[11] + 3*cnpj[12]
    v[1] += 2*cnpj[13]
    v[1] = 11 - (v[1] % 11)
    v[1] = v[1] >= 10? 0 : v[1]

    // True iff the verification digits are as expected
    return v[0] == cnpj[13] && v[1] == cnpj[14]
}


// Everytime the user changes his input, this algorithm checks
// wether input has a Valid CNPJ format or not.
newInput.addEventListener('input', function(e){
    // e.preventDefault();
    let CNPJ = newInput.value;
    if (CNPJ == null){
        CNPJ_valid.innerHTML = "NO"
        return
    }
    // reFormat1 finds 00.000.000/0000-00... format and 
    // reFormat2 finds 00000000000000... format
    // Here the dots ... means or 0 or more numbers
    const reFormat1 = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    if(CNPJ.length != 18 || !reFormat1.test(CNPJ)){
        const reFormat2 = /^\d{14}$/
        if (CNPJ.length != 14 || !reFormat2.test(CNPJ)){
            CNPJ_valid.innerHTML = "NO"
            return
        }
    }
    else{
        const reSpecial = /[\.\/-]/
        CNPJ = CNPJ.split(reSpecial).join("") // Removes all . / and - from CNPJ
    }
    CNPJ = CNPJ.split("").map(Number); // formats CNPJ to be used as an input to validateCNPJ algorithm
    if(validateCNPJ(CNPJ))
        CNPJ_valid.innerHTML = "YES";
})

// The code above works for 40.229.599/0001-54 and 40229599000154

// Non-complete battery of tests:

// const myRe = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})|(\d{14})$/
// const string1 = "00.000.000+0000-00" // bad input
// const string2 = "1234567890123452" // bad input

// if(string1.length != 18 || myRe.test(string1)){
//     document.body.style.backgroundColor = "red";
// }
// if(string2.length != 14 || myRe.test(string2)){
//     document.body.style.backgroundColor = "green";
// }