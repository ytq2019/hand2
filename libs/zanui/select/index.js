Component({
    properties: {
        items: {
            type: Array,
            value: []
        },
        name: {
            type: String,
            value: ""
        },
        checkedValue: {
            type: String,
            value: ""
        },
        activeColor: {
            type: String,
            value: "#ff4444"
        }
    },
    methods: {
        handleSelectChange: function(e) {
            e = e.detail.value;
            this.triggerEvent("change", {
                value: e
            });
        }
    }
});