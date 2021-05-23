Component({
    relations: {
        "../cell/index": {
            type: "child",
            linked: function() {
                this._updateIsLastCell();
            },
            linkChanged: function() {
                this._updateIsLastCell();
            },
            unlinked: function() {
                this._updateIsLastCell();
            }
        }
    },
    data: {
        cellUpdateTimeout: 0
    },
    methods: {
        _updateIsLastCell: function() {
            var t, e = this;
            0 < this.data.cellUpdateTimeout || (t = setTimeout(function() {
                e.setData({
                    cellUpdateTimeout: 0
                });
                var l, t = e.getRelationNodes("../cell/index");
                0 < t.length && (l = t.length - 1, t.forEach(function(t, e) {
                    t.updateIsLastCell(e === l);
                }));
            }), this.setData({
                cellUpdateTimeout: t
            }));
        }
    }
});