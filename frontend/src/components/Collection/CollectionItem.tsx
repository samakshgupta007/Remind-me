import * as React from 'react';
import { Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

export default function CollectionItem() {
    const searchParams = new URLSearchParams(window.location.search);
    const collectionId = searchParams.get('collectionId');
    const collectionName = searchParams.get('collectionName');

    return (
        <Container>
            <Grid item xs={12} md={12} marginTop={2}>
                <Card sx={{ display: 'flex' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <a href="/">Back</a>
                        <div style = {{marginTop: '10px'}}>
                        Get reminded about {collectionName}
                        </div>
                        <div>
                            <p style={{fontSize: '12px', opacity: '0.8'}}>EMAIL *</p>
                            <input type="email" style={{width: '30%'}}/>
                        </div>
                        <div style = {{marginTop: '10px'}}>
                            <span style={{fontSize: '12px', opacity: '0.8'}}> AGREE TO OUR TERMS AND CONDITIONS</span>
                            <input type="checkbox" id="tandc" name="tandc" checked={true} style={{margin: '10px'}}/>
                        </div>
                        <hr/>
                        <div style = {{display: 'flex', justifyContent: 'flex-end'}}>
                        <button style = {{ border: '0.5px solid grey',borderRadius: '10px', padding: '15px 20px', width: '20%', marginTop: '10px'}}>SUBMIT</button>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
}
