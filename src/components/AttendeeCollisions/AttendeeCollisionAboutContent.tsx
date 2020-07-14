import React from 'react';
import { Typography, Link } from '@material-ui/core';

const AttendeeCollisionAboutContent: React.FC = () => {
    return (
        <>
            <Typography variant="h3">About {process.env.REACT_APP_APP_NAME}</Typography>
            <Typography>
                {process.env.REACT_APP_APP_NAME} is an app that connects people at conferences authentically and efficiently. We take care of the digital connection so you can focus on the human one. Our goal is that you stay present in connecting with others so that when you return from the conference you have strong human connections and solid notes for following up effectively. Designed for both event organizers and attendees, Conference-Coin is designed to help app users achieve their conference goals.
            </Typography>
            <Typography>
                Your contact cards each have a place to make notes and if you scan someone already in your list, {process.env.REACT_APP_APP_NAME} reminds you where you met them and shows you your previous notes. It also features an events calendar and sponsors list. Your dashboard keeps you up to date on event related notifications.
            </Typography>
            <Typography>
                Every time you scan, you earn Collision Coins which can be used, depending on the organizer, in different ways from voting on pitch competitions to drink tickets.
            </Typography>
            <Typography>
                {process.env.REACT_APP_APP_NAME} allows the organizer to create seminars or meetups on the fly, based on live data about their conference, send out notification to attendees and provides other anonymous analytics that helps to inform decisions for the conference.
            </Typography>
            <Typography>
                Please reach out to us with any of your comments, questions, feedback, or for support using the app:
            </Typography>
            <Typography>
                Reach us about questions: <Link color="textSecondary" target="_blank" href="mailTo:help@conference-quest.com">help@conference-quest.com</Link>
            </Typography>
            <Typography>
                Book us for your event: <Link color="textSecondary" target="_blank" href="mailTo:sales@conference-quest.com">sales@conference-quest.com</Link>
            </Typography>
            <Typography>
                Technical support: <Link color="textSecondary" target="_blank" href="mailTo:support@conference-quest.com">support@conference-quest.com</Link>
            </Typography>
        </>);
}

export default (AttendeeCollisionAboutContent);