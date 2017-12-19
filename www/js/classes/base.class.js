class Base {

    renderHTML(html, type) {
        if (type == "modal") {
            $('#rendermodalhere').html(html)
        } else if (type == 'board') {
            $('#board').html(html)
        } else {
            $('main').html(html);
        }
    }

}
