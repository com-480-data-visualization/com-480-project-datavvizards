import React, { Fragment } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Card, CardHeader, CardContent, Paper, Box, Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    descriptionCard: {
        height: "50%",
        marginBottom: 20,
        overflow: "hidden",
    },
    descriptionContentContainer: {
        overflowY: "auto",
        top: -20,
        height: "100%",
        padding: 10,
        marginBottom: -10,
    },
    descriptionContent: {
        overflowY: "auto", 
        height: "100%",
    }
}))

export default () => {
    const classes = useStyles();

    return (
        <Paper className={classes.descriptionCard}>
            <Box className={classes.descriptionContentContainer}>
                <div className={classes.descriptionContent}>
                    <Typography variant="subtitle1">Description</Typography>
                    <Typography variant='body1'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pharetra posuere lectus, et dignissim erat bibendum a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed fermentum dolor, et faucibus ex. Fusce a porta lorem, vitae tempus ante. Fusce metus magna, placerat et laoreet vitae, aliquam quis lectus. Sed ac ullamcorper libero, ut varius lacus. Suspendisse quis facilisis odio. In facilisis viverra mi vel tempus. Donec blandit dui vel pulvinar auctor. Aliquam in varius ligula. Nullam vestibulum auctor dui a finibus. Pellentesque commodo viverra tellus eget ultricies. Praesent mi sapien, auctor quis rutrum sit amet, venenatis a sem. Donec molestie pretium sapien eget tristique.

                        Quisque vel quam tortor. Etiam eleifend ex et consequat ultrices. Proin faucibus diam ornare eros malesuada laoreet. Praesent auctor elit a mi scelerisque, ut scelerisque nibh ornare. Sed at metus sed ipsum luctus auctor et a est. Maecenas rhoncus turpis id diam mollis pulvinar. Proin in orci venenatis, pharetra odio a, egestas purus. Curabitur cursus eros ac volutpat lacinia.

                        Nullam ultricies, risus vitae consequat rutrum, lorem sem tristique tortor, non imperdiet dui lorem eget mi. Praesent in molestie risus, vitae volutpat sapien. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum semper pulvinar tortor. Vivamus malesuada elit nec ex mollis, non pretium eros mattis. Nunc ut purus at nunc rutrum sollicitudin et finibus enim. Aliquam erat volutpat. Nam lacinia dapibus massa, eu blandit ipsum tincidunt et. Donec eu sapien nulla. Integer at pharetra leo. Duis semper mollis elit a fringilla. Suspendisse vulputate laoreet tortor at luctus.
                    </Typography>
                </div>
            </Box>
        </Paper>
    )
}