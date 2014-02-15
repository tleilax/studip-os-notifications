(function ($, OldUpdate) {
    if (!'Notification' in window || !'localStorage' in window) {
        return;
    }
    
    var storage = window.localStorage;
    
    console.log('should notify!');
    
    function Notify(text, url) {
        var spawn = function () {
            console.log('spawning notification');
            var notification = new Notification(text, {
                icon: STUDIP.ASSETS_URL + 'images/touch-icon-ipad3.png',
                body: 'foooooooo'
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
    
    var known_ids = JSON.parse(storage.getItem('studip-notifications') || '[]');
    
    STUDIP.PersonalNotifications.update = function () {
        console.log('update');
        
        OldUpdate();

        $('#notification_list li').each(function () {
            var id = $(this).data().id;
            if (known_ids.indexOf(id) === -1) {
                console.log('unknown id');

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
            console.log('update known ids');
            known_ids = JSON.parse(event.newValue);
        }
    });
    
}(jQuery, STUDIP.PersonalNotifications.update));