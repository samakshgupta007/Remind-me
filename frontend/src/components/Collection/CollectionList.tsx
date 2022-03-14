import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container, Modal, Box, Alert } from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Collection {
    id: string;
    name: string;
    launchDate: Date | null;
}

export default function CollectionList() {
    const [collections, setCollections] = React.useState([
            {id: '1', name: 'Skies of Tokyo', launchDate: new Date('2022-06-01')},
            {id: '2', name: 'Reigns of Valour', launchDate: new Date('2022-05-14')},
            {id: '3', name: 'James Bond Collectibles', launchDate: new Date('2022-04-20')},
            {id: '4', name: 'Football Stars', launchDate: new Date('2022-07-06')},
            {id: '5', name: 'Views from a Skyscraper', launchDate: new Date('2022-05-21')},
            {id: '6', name: 'Legends of Anime', launchDate: new Date('2022-03-27')}
        ] as Collection[])
    const [alert, setAlert] = React.useState({
        active: false as boolean,
        content: '' as string,
        severity: 'error' as 'error' | 'success'
    });
    const [selectedCollection, setSelectedCollection] = React.useState({id: '', name: '', launchDate: new Date() as Date | null})
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [reminderModalOpen, setReminderModalOpen] = React.useState(false);
    const [reminderForm, setReminderForm] = React.useState({email: '', checked: true});

    const setEmailReminder = async () => {
        if(!reminderForm.checked){
            setAlert({
                active: true,
                content: 'Please ensure you agree to the terms and conditions',
                severity: 'error'
            })
            return;
        }
        const response = await axios.post("http://localhost:3001/api/v1/collection/reminder", {
            email: reminderForm.email,
            collectionId: selectedCollection.id
        })
        setReminderModalOpen(false);
        setAlert({
            active: true,
            content: response.data.message,
            severity: 'success'
        })
    }

    const editCollection = async () => {
        const collectionIndex = collections.findIndex(el => el.id === selectedCollection.id);
        const updatedCollections = collections;
        updatedCollections[collectionIndex].name = selectedCollection.name;
        updatedCollections[collectionIndex].launchDate = selectedCollection.launchDate;
        setCollections(updatedCollections);

        const response = await axios.put(`http://localhost:3001/api/v1/collection/${selectedCollection.id}`, {
            name: selectedCollection.name,
            launchDate: selectedCollection.launchDate
        })
        setAlert({
            active: true,
            content: response.data.message,
            severity: 'success'
        })
        setEditModalOpen(false);
    }

    React.useEffect(() => {
        if(alert.active){
            setTimeout(() => {
                setAlert({active: false, content: '', severity: 'error'})
            }, 3000)
        }
    }, [alert]);

    React.useEffect(() => {
        async function fetchData() {
            const collections = await axios.get('http://localhost:3001/api/v1/collection');
            if(collections?.data?.length > 0){
                setCollections(collections.data);
                setAlert({
                    active: true,
                    content: 'Collections data fetched successfully',
                    severity: 'success'
                })
            }
        }
        fetchData();
    }, []);

    return (
        <Container>
            {alert.active ? <Alert severity={alert.severity}>{alert.content}</Alert> : <></> }
            <Modal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: 'white', border: '2px solid #000' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ padding: '10px 20px' }}>
                        Edit Collection
                    </Typography>
                    <Typography id="modal-modal-description" style={{ padding: '10px 20px' }}>
                        <Typography component="h2" variant="h5">
                            <input type="text" value={selectedCollection.name} onChange={(e) => setSelectedCollection({ ...selectedCollection, name: e.target.value })} />
                        </Typography>
                        <DatePicker showTimeSelect dateFormat="Pp" id="datepicker" selected={selectedCollection.launchDate ? new Date(selectedCollection.launchDate) : null} onChange={(date: Date) => setSelectedCollection({ ...selectedCollection, launchDate: date })}>
                        </DatePicker>
                        <button style={{ marginTop: '10px' }} onClick={() => {
                            const datepicker = document.getElementById("datepicker")
                            //@ts-ignore
                            datepicker.value = null;
                            setSelectedCollection({...selectedCollection, launchDate: null})
                        }}>TBD</button>
                         <div>
                            <button style={{ marginTop: '10px' }} onClick={() => editCollection()}>Save</button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={reminderModalOpen}
                onClose={() => setReminderModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: 'white', border: '2px solid #000' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ padding: '10px 20px' }}>
                        Remind me!
                    </Typography>
                    <Card sx={{ display: 'flex' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <a href="/">Back</a>
                            <div style={{ marginTop: '10px' }}>
                                Get reminded about {selectedCollection.name}
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', opacity: '0.8' }}>EMAIL *</p>
                                <input type="email" name = "email" style={{ width: '30%' }} onChange = {(e) => setReminderForm({...reminderForm, email: e.target.value})}/>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <span style={{ fontSize: '12px', opacity: '0.8' }}> AGREE TO OUR TERMS AND CONDITIONS</span>
                                <input type="checkbox" id="tandc" name="checkbox" checked={reminderForm.checked} style={{ margin: '10px' }} onChange={() => setReminderForm({...reminderForm, checked: !reminderForm.checked})} />
                            </div>
                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type = "submit" style={{ border: '0.5px solid grey', borderRadius: '10px', padding: '15px 20px', width: '30%', marginTop: '10px' }} onClick={() => setEmailReminder()}>SUBMIT</button>
                            </div>
                    </CardContent>
                </Card>
            </Box>
            </Modal>
            <Grid container spacing={2} marginTop={2}>
                {collections.map((item: Collection, i: number) => {
                    return (
                        <Grid item xs={12} md={12} key={item.id}>
                            <Card sx={{ display: 'flex' }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography component="h2" variant="h5">
                                        <p>{item.name}</p>
                                    </Typography>
                                    <Typography component="h2" variant="h5">
                                        <p>{item.launchDate ? moment(item.launchDate).format('DD/MM/YYYY HH:mm a') : 'TBD'}</p>
                                    </Typography>
                                </CardContent>
                                <p
                                    style={{
                                        marginRight: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'underline',
                                        color: 'blue',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setSelectedCollection(item);
                                        setReminderModalOpen(true);
                                    } }>
                                    Remind me
                                </p>
                                <p
                                    style={{
                                        marginRight: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'underline',
                                        color: 'blue',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setSelectedCollection(item);
                                        setEditModalOpen(true);
                                    } }>
                                    Edit
                                </p>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container >
    );
}
