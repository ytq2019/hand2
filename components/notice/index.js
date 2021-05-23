var app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        noticeList: {
            type: Array,
            value: []
        },
        height: {
            type: Number,
            value: 80
        },
        textColor: {
            type: String,
            value: ""
        }
    },
    data: {},
    methods: {
        toClick: function(t) {
            this.triggerEvent("click", {
                url: t.currentTarget.dataset.url,
                title: t.currentTarget.dataset.title
            });
        }
    }
});