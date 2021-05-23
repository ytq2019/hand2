Component({
    properties: {
        size: String,
        stepper: {
            type: Number,
            value: 1
        },
        min: {
            type: Number,
            value: 1
        },
        max: {
            type: Number,
            value: 1 / 0
        },
        step: {
            type: Number,
            value: 1
        }
    },
    methods: {
        handleZanStepperChange: function(e, t) {
            var n = e.currentTarget.dataset, a = (void 0 === n ? {} : n).disabled, e = this.data.step, n = this.data.stepper;
            if (a) return null;
            "minus" === t ? n -= e : "plus" === t && (n += e), this.triggerEvent("change", n), 
            this.triggerEvent(t);
        },
        handleZanStepperMinus: function(e) {
            this.handleZanStepperChange(e, "minus");
        },
        handleZanStepperPlus: function(e) {
            this.handleZanStepperChange(e, "plus");
        },
        handleZanStepperBlur: function(e) {
            var t = this, n = e.detail.value, e = this.data, a = e.min, e = e.max;
            n ? (e < (n = +n) ? n = e : n < a && (n = a), this.triggerEvent("change", n)) : setTimeout(function() {
                t.triggerEvent("change", a);
            }, 16);
        }
    }
});