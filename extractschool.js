// IMPORTS
const fs = require('fs')
const path = require('path')

// GLOBAL
const args = process.argv.slice(2)
const runtime = (
    function findRuntimeName() {
        const base = path.basename(process.argv[0])
        return base.slice(0, base.length - path.extname(base).length)
    }
)()
const help =
    `
    GRAD DATA EXTRACTOR  v1
    >>> BY HADEN FLETCHER <<<

    Extracts graduates' names from input PDF data.

    This utility is designed to specificaly work with data extracted
    by Tabula. Please feel free to update it with other sources!

Usage:
    ${runtime} ${path.basename(process.argv[1])} <path> [...arguments]

** THE <path> IS ALSO INTERPRETED AS THE NAME OF THE SCHOOL. **
** E.G. USING 'north' WILL RESULT IN THE school FIELD IN     **
** APPLICABLE OUTPUTS BEING POPULATED WITH 'north'.          **

Arguments:
    --csv,   -c    Output to a CSV file.        Format: name,school
    --list,  -l    Output to a JSON array.      Format: ["name","name",...]
    --text,  -t    Output to a plaintext list.  Format name
                                                       name
                                                       ...

Thank you for using my CLI utility!`

// CHECK ARGUMENTS
if (!(
    args.length >= 1
)) {
    console.log(help)
    process.exit()
}

if (!(
    fs.existsSync(path.join(__dirname, args[0]))
)) {
    throw new ReferenceError('Reference path does not exist')
}

// DEPENDENT
const usepath = path.join(__dirname, args[0])
const formats = []

    ; (
        function findFormats() {
            if (
                args.includes('-c') || args.includes('--csv')
            )
                formats.push('csv')

            if (
                args.includes('-l') || args.includes('--list')
            )
                formats.push('json')

            if (
                args.includes('-t') || args.includes('--text')
            )
                formats.push('text')
        }
    )()

    ; (
        function run() {
            if (!formats.length)
                throw new SyntaxError('No output formats specified')

            const data = JSON.parse(fs.readFileSync(path.join(usepath, 'data.json')))
            const school = args[0]

            let names = []
            let outjson = formats.includes('json') ? [] : undefined
            let outtext = formats.includes('text') ? '' : undefined
            let outcsv = formats.includes('csv') ? 'name,school\n' : undefined

            for (const dataset of data)
                for (const datalist of dataset['data'])
                    for (const entry of datalist) {
                        const name = entry['text'].replace(/^([\W]+) (.+)$/gm, '$2') // remove charms (if applicable)
                        names.push(name)
                    }

            names = names.sort()

            for (const name of names) {
                if (formats.includes('json'))
                    outjson.push(name)
                if (formats.includes('text'))
                    outtext += `${name}\n`
                if (formats.includes('csv'))
                    outcsv += `${name},${school}\n`
            }

            if (outjson)
                fs.writeFileSync(path.join(usepath, school + '-array.json'), JSON.stringify(outjson))
            if (outtext)
                fs.writeFileSync(path.join(usepath, school + '-list.txt'), outtext)
            if (outcsv)
                fs.writeFileSync(path.join(usepath, school + '.csv'), outcsv)
        }
    )()
