import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

// ROUTE POUR LA CREATION D'UN MEETING ZOOM
router.post('/createZoomMeeting', async (req, res) => {
    const param = {
        "agenda": "My Meetings",
        "duration": req.body.duration,
        "start_time": req.body.start_time,
        "timezone": "Europe/Paris",
        "topic": req.body.topic,
        "type": 2
    }

    try {
        const token = await getOAuth2Token();
        const data = await createZoomMeeting(token, param);

        res.status(200).send({
            message: 'Le meeting a été créé correctement',
            data,
        });
    } catch (error) {
        console.error('Erreur lors de l\'appel API vers Zoom:', error.message);

        res.status(500).send({
            message: 'Erreur lors de l\'appel API vers Zoom',
            error: error.message,
        });
    }
});

// ROUTE POUR LA SUPPRESSION D'UN MEETING ZOOM
router.post('/deleteZoomMeeting', async (req, res) => {
    const uuid = req.body.zoomId;
    try {
        const token = await getOAuth2Token();
        const data = await deleteZoomMeeting(token, uuid);

        res.status(200).send({
            message: 'Le meeting a été supprimé correctement',
            data,
        });
    } catch (error) {
        console.error('Erreur lors de l\'appel API vers Zoom:', error.message);

        res.status(500).send({
            message: 'Erreur lors de l\'appel API vers Zoom',
            error: error.message,
        });
    }
});

// AUTHENTIFICATION AUPRES DU SERVEUR D'IDENTITE DE ZOOM
async function getOAuth2Token() {
    const response = await fetch('https://zoom.us/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic YTNZMVNtdUNUeGFBVXk5Zlk4Y3JkUTpiNkFzd1FDYk5XRW1wdjRPdHVDUTlZcEV2VGkzR245aQ==' // A PROTEGER EN PRODUCTION - SUR AWS SECRET MANAGER PAR EX.
        },
        body: new URLSearchParams({
            grant_type: 'account_credentials',
            account_id: 'UYW3woF2QAeDUqz62wWkpA' // A PROTEGER EN PRODUCTION - SUR AWS SECRET MANAGER PAR EX.
        })
    });

    if (!response.ok) {
        throw new Error(`Echec lors de la récupération du token: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.access_token) {
        throw new Error('Le token d\'accès est manquant dans la réponse');
    }

    return data.access_token;
}

// FONCTION DE CREATION DU MEETING ZOOM
async function createZoomMeeting(token, param) {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(param),
    });
    if (!response.ok) {
        throw new Error(`Echec lors de la création du meeting : ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// FONCTION DE SUPPRESSION DU MEETING ZOOM
async function deleteZoomMeeting(token, id) {
    console.log(`https://api.zoom.us/v2/meetings/${id}`);
    const response = await fetch(`https://api.zoom.us/v2/meetings/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        throw new Error(`Echec lors de la suppression du meeting : ${response.status} ${response.statusText}`);
    }

    return response;
}

export default router;