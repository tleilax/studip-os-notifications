(function ($, OldUpdate) {
    if (!'Notification' in window || !'localStorage' in window) {
        return;
    }

    var storage = window.localStorage,
        known_ids = JSON.parse(storage.getItem('studip-notifications') || '[]');

    function Notify(text, url) {
        var spawn = function () {
            var notification = new Notification('Nachricht von Stud.IP', {
                icon: STUDIP.ASSETS_URL + 'images/touch-icon-ipad3.png',
                body: text
            });
            if (url) {
                notification.onclick = function () {
                    location.href = url;
                    window.focus();
                };
            }
        };

        if (Notification.permission === 'granted') {
            spawn();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (!'permission' in Notification) {
                    Notification.permission = permission;
                }
                if (permission === 'granted') {
                    spawn();
                }
            })
        }
    }

    STUDIP.PersonalNotifications.update = function () {
        OldUpdate();

        $('#notification_list li').each(function () {
            var id = $(this).data().id;
            if (known_ids.indexOf(id) === -1) {
                var text = $(this).text().trim(),
                    url = $(this).find('a[href]').attr('href');
                Notify(text, url);

                known_ids.push(id);
                storage.setItem('studip-notifications', JSON.stringify(known_ids));
            } 
        });
    };

    $(window).bind('storage', function (event) {
        event = event.originalEvent;
        if (event.key === 'studip-notifications') {
            known_ids = JSON.parse(event.newValue);
        }
    });
}(jQuery, STUDIP.PersonalNotifications.update));