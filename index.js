const schemeListEl = document.getElementById('scheme')
const colorPickerEl = document.getElementById('color-picker')
const paletteSection = document.getElementById('palette')

const availableSchemes = ['monochrome', 'monochrome-dark', 'monochrome-light', 'analogic', 'complement', 'analogic-complement', 'triad', 'quad']

const localStorageKey = 'color-app'
const localStorageKeyModeKey = 'color-app-mode'

const savedPalette = JSON.parse(localStorage.getItem(localStorageKey))
const savedMode = JSON.parse(localStorage.getItem(localStorageKeyModeKey))

populateOptions()

if (savedPalette) {
    renderPalette(savedPalette)
}

function populateOptions() {
    availableSchemes.forEach(scheme => {
        const option = document.createElement('option')
        option.id = scheme
        option.textContent = scheme

        if (scheme === savedMode) {
            option.selected = true
        }

        schemeListEl.appendChild(option)
    })
}

document.addEventListener('submit', function (e) {
    e.preventDefault()

    paletteSection.innerHTML = ''
    const color = colorPickerEl.value
    const mode = schemeListEl.value
    getPalette(colorPickerEl.value, schemeListEl.value)

})

function getPalette(color, mode) {

    let palette = []


    const colorTrimmed = color.slice(1)
    fetch(`https://www.thecolorapi.com/scheme?hex=${colorTrimmed}&mode=${mode}&count=5`)
        .then(res => res.json())
        .then(data => {
            data.colors.forEach(color => {
                palette.push(color.hex.value)
            })
            renderPalette(palette, mode)
        })
}

function renderPalette(palette, mode) {

    palette.forEach(value => {

        let wrapperDiv = document.createElement('div')

        let p = document.createElement('p')
        p.textContent = value

        p.onclick = async function copyToClipboard() {
            try {
                await navigator.clipboard.writeText(value);
                console.log('Text successfully copied to clipboard');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
        

        let colorDiv = document.createElement('div')
        colorDiv.className = 'color-div'
        colorDiv.style.background = value
        wrapperDiv.appendChild(colorDiv)
        wrapperDiv.appendChild(p)

        paletteSection.appendChild(wrapperDiv)


    })

    localStorage.setItem(localStorageKey, JSON.stringify(palette))
    localStorage.setItem(localStorageKeyModeKey, JSON.stringify(mode))

}

