class Base {

    renderHTML(html, type) {
        if (type == "modal") {
            $('main').append(html)
        } else if (type == 'board') {
            $('#board').html(html)
        } else {
            $('main').html(html);
        }
    }

}