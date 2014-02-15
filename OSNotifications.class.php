<?php
class OSNotifications extends StudIPPlugin implements SystemPlugin
{
    public function __construct()
    {
        parent::__construct();

        if (Request::int('osn_add')) {
            PersonalNotifications::add(array($GLOBALS['user']->id), URLHelper::getLink('dispatch.php/profile'), 'foo');
        }

        PageLayout::addScript($this->getPluginURL() . '/vendor/HTML5-Desktop-Notifications/desktop-notify-min.js');
        PageLayout::addScript($this->getPluginURL() . '/os-notifications.js');
    }
}

