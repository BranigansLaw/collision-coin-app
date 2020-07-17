import React from 'react';
import { createStyles, withStyles, Typography, Link, WithStyles, Box } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
    toc: {
        '& .MuiLink-root': {
            color: theme.palette.secondary.contrastText,
            textDecoration: 'underline',
        }
    },
});

const tableOfContents = [
    {
        index: 'SignIn',
        title: 'Sign in',
        content: (
            <Typography>
                You can sign in using an email and password, LinkedIn or google. If you sign in with all three you can use any one of them to sign in.
            </Typography>
        ),
    },
    {
        index: 'Scanning',
        title: 'Scanning',
        content: (
            <>
                <Typography>
                    Tap the large central button to open the scanning window.
                </Typography>
                <Typography>
                    The first time you use it, you will have to give Collison-Coin permission to use your camera.
                </Typography>
                <Typography>
                    Place the QR code you wish to scan in the line of sight of your camera and wait.
                </Typography>
                <Typography>
                    {process.env.REACT_APP_APP_NAME} automatically knows the type of QR code you scanned and will present the appropriate information to you.
                </Typography>
            </>
        ),
    },    
    {
        index: 'Attendees',
        title: 'Attendees',
        content: (
            <>
                <Typography>
                    When you scan another attendee you will be presented with one of two things.
                </Typography>
                <ol>
                    <li>
                        <Typography>If you are online you will see their complete contact card with all information they have shared. You can enter notes about the person or select the Edit icon (pencil) to edit the contact information.</Typography>
                    </li>
                    <li>
                        <Typography>If you are off-line you will see a popup mini card with the persons name and company and a place for you to make notes. When you save the information you will get a message telling you that the information and the users complete contact card will be available when you have an internet connection. Your notes and connection will be stored locally until such time.</Typography>
                    </li>
                </ol>
            </>
        ),
    },    
    {
        index: 'Calendar',
        title: 'Calendar',
        content: (
            <>
                <Typography>
                    Open the calendar by selecting the calendar icon at the bottom of the screen.
                </Typography>
                <Typography>
                    You can scroll through the calendar of events.
                </Typography>
                <Typography>
                    You can see more information about an event by clicking the open arrow on the event card.
                </Typography>
                <Typography>
                    Close the event info by selecting the close arrow or by clicking one of the other main navigation icons at the bottom of the screen.
                </Typography>
            </>
        ),
    },    
    {
        index: 'Contacts',
        title: 'Contacts',
        content: (
            <>
                <Typography>
                    Open your contact list by selecting the contacts icon at the bottom of the screen.
                </Typography>
                <Typography>
                    About {process.env.REACT_APP_APP_NAME} will be at the top. Select it to find out more about {process.env.REACT_APP_APP_NAME}.
                </Typography>
                <Typography>
                    Your own card will be next on the list.
                </Typography>
                <Typography>
                    Select your own card to access the card and edit functionality.
                </Typography>
                <Typography>
                    Select any of your contact cards to view their information.
                </Typography>
                <Typography>
                    Information you edit about yourself becomes live on the system and will update in all your contacts address books.
                </Typography>
                <Typography>
                    Information you edit about your contacts will only be available in your address book.
                </Typography>
                <Typography>
                    You can delete a contact, but know you will lose any points you got by scanning them. And, you will get less points the next time you scan them.
                </Typography>
                <Typography>
                    A contact will still have your contact information as it is published.
                </Typography>
            </>
        ),
    },    
    {
        index: 'ContactConferenceQuest',
        title: `Contact ${process.env.REACT_APP_APP_NAME} during the event`,
        content: (
            <>
                <Typography>
                    Reach us about questions: <Link color="textSecondary" target="_blank" href="mailTo:help@conference-quest.com">help@conference-quest.com</Link>
                </Typography>
                <Typography>
                    Book us for your event: <Link color="textSecondary" target="_blank" href="mailTo:sales@conference-quest.com">sales@conference-quest.com</Link>
                </Typography>
                <Typography>
                    Technical support: <Link color="textSecondary" target="_blank" href="mailTo:support@conference-quest.com">support@conference-quest.com</Link>
                </Typography>
            </>
        ),
    },    
    {
        index: 'LogOut',
        title: 'Log Out',
        content: (
            <>
                <Typography>
                    Select log out from the drop down menu in the sameplace you found help.
                </Typography>
                <Typography>
                    Select log out or cancel.
                </Typography>
            </>
        ),
    },  
    {
        index: 'RevokePermissions',
        title: 'Revoke Permissions',
        content: (
            <>
                <Typography>
                    Select Revoke permissions from the drop down menu
                </Typography>
                <Typography>
                    Revoke permissions will remove any permissions you granted Collision-coin on your device such as access to your camera.
                </Typography>
                <Typography>
                    We always ask for permission and give you the ability to delete your data at any time.
                </Typography>
            </>
        ),
    },      
];

interface IProps extends WithStyles<typeof styles> {}

const HelpPage: React.FC<IProps> = ({
    classes
}) => {
    return (
        <Box className={classes.root}>
            <Box className={classes.toc}>
                <Typography variant="h4">Table of Contents</Typography>
                {tableOfContents.map(i => (
                    <Typography key={i.index}>
                        <Link href={`#${i.index}`}>
                            {i.title}
                        </Link>
                    </Typography>
                ))}
            </Box>
            <>
                {tableOfContents.map(i => (
                    <Box key={i.index}>
                        <hr />
                        <Typography id={i.index} variant="h4">{i.title}</Typography>
                        {i.content}
                    </Box>
                ))}
            </>
        </Box>
    );
}

export default withStyles(styles)(HelpPage);