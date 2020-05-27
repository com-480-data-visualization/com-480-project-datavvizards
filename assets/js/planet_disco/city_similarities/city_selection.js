export class CitySelector {
    constructor(data) {
        this.data = data
    }

    //Remove selection from a city if one was selected
    reset = (el) => {
        let changed = false;
        if (el) {
            changed = el.highlight
            el.selected = false;
            el.highlight = false;
        }
        return changed;
    }

    setSelectedElement = (d) => {
        let prev = this.reset(this.selection);
        this.selection = d;
        this.addEffect(d);
        return prev;
    }

    setMouseOverElement = (d) => {
        let changed = true;

        if (!this.mouseOver && !d) {
            changed = this.deselectedAll;
            this.deselectedAll = true;
            return changed;
        } else {
            this.deselectedAll = false;
        }

        if (this.mouseOver && (!this.selection || this.mouseOver.id != this.selection.id))
            changed = this.reset(this.mouseOver);
        this.mouseOver = d;
        this.addEffect(d);
        return changed;
    }

    addEffect = (d) => {
        if (d) {
            d.selected = true;
            d.highlight = true;
        }
    }

    findCity = (cityId) => {
        if (cityId == 0)
            return null;

        var city = null;
        for (let d of this.data) {
            if (d.id == cityId) {
                city = d;
                break;
            }
        }
        return city;
    }
}