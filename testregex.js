const text =
    `
Emma Graduating Senior
* Samantha Senior Person
Noah The Graduate
Joel Generic Kid
*^~ Jamie Is Graduating
Katherine The Great
Tanner Graduator`

const regex = /^([\W]+) (.+)$/gm
const newstring = text.replace(regex, '$2')

console.log(newstring)
