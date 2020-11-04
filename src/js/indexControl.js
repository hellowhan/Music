(function(root) {
    function Index(len) {
        this.index = 0; // 当前的索引
        this.len = len; // 数据的长度，用于做判断
    }
    Index.prototype = {
        //这个方法用来取上一个索引(上一首)
        prev() {
            return this.get(-1)
        },
        next() {
            return this.get(1)
        },
        get(val) {
            this.index = (this.index + val + this.len) % this.len
            return this.index


        }
    }

    root.controlIndex = Index
})(window.player || (window.player = {}))