import { useEffect, useState } from "react";
import { uploadResume } from "../services/uploadService";
import { parseResume } from "../services/resumeService";

import {
    getCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
} from "../services/candidateService";

import {
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Button,
    Stack,
    IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// default export of the Candidates component
export default function Candidates() {

    const [candidates, setCandidates] = useState([]);
    const [resume, setResume] = useState(null);
    const [candidate, setCandidate] = useState({
        full_name: "",
        email: "",
        phone: "",
        skills: "",
        experience: "",
    });

    // state to track the ID of the candidate being edited
    const [editingId, setEditingId] = useState(null);

    // function to load candidates from the backend
async function loadCandidates() {
        try {
            const data = await getCandidates();
            setCandidates(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadCandidates();
    }, []);

    // function to handle parsing the resume
async function handleParseResume() {

    try {

        const data = await parseResume(resume);

        setCandidate({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            skills: Array.isArray(data.skills)
                ? data.skills.join(", ")
                : "",
            experience: "",
            resume_path: data.resume_path,
        });

    } catch (error) {
        console.error(error);
    }

}

    // function to handle form submission for adding a candidate
async function handleSubmit() {
    try {

        let resumePath = candidate.resume_path || null;

        if (resume) {
            const uploaded = await uploadResume(resume);
            resumePath = uploaded.path;
        }

        const candidateData = {
            ...candidate,
            resume_path: resumePath,
        };

        if (editingId) {
            await updateCandidate(editingId, candidateData);
            setEditingId(null);
        } else {
            await createCandidate(candidateData);
        }

        setCandidate({
            full_name: "",
            email: "",
            phone: "",
            skills: "",
            experience: "",
            resume_path: "",
        });

        setResume(null);

        loadCandidates();

    } catch (error) {
        console.error(error);
    }
}
    // function to handle editing a candidate
    function handleEdit(candidate) {

        setCandidate({
            full_name: candidate.full_name,
            email: candidate.email,
            phone: candidate.phone,
            skills: candidate.skills,
            experience: candidate.experience,
        });

        setEditingId(candidate.id);

    }

    // function to handle deleting a candidate
async function handleDelete(id) {

        try {

            await deleteCandidate(id);

            loadCandidates();

        } catch (error) {
            console.error(error);
        }

    }

    return (
        <Container sx={{ mt: 4 }}>

            <Typography variant="h4" gutterBottom>
                Candidates
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>

                <TextField
                    label="Full Name"
                    value={candidate.full_name}
                    onChange={(e) =>
                        setCandidate({
                            ...candidate,
                            full_name: e.target.value,
                        })
                    }
                />

                <TextField
                    label="Email"
                    value={candidate.email}
                    onChange={(e) =>
                        setCandidate({
                            ...candidate,
                            email: e.target.value,
                        })
                    }
                />

                <TextField
                    label="Phone"
                    value={candidate.phone}
                    onChange={(e) =>
                        setCandidate({
                            ...candidate,
                            phone: e.target.value,
                        })
                    }
                />

                <TextField
                    label="Skills"
                    value={candidate.skills}
                    onChange={(e) =>
                        setCandidate({
                            ...candidate,
                            skills: e.target.value,
                        })
                    }
                />

                <TextField
                    label="Experience"
                    value={candidate.experience}
                    onChange={(e) =>
                        setCandidate({
                            ...candidate,
                            experience: e.target.value,
                        })
                    }
                />
                <Button
                    variant="outlined"
                    component="label"
                >
                    {resume ? resume.name : "Choose Resume"}
                                
                    <input
                        hidden
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResume(e.target.files[0])}
                    />
                </Button>
                
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleParseResume}
                    disabled={!resume}
                >
                    Parse Resume
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {editingId ? "Update Candidate" : "Add Candidate"}
                </Button>

            </Stack>

            <Paper>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Skills</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Actions</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {candidates.map((candidate) => (

                            <TableRow key={candidate.id}>

                                <TableCell>{candidate.full_name}</TableCell>
                                <TableCell>{candidate.email}</TableCell>
                                <TableCell>{candidate.phone}</TableCell>
                                <TableCell>{candidate.skills}</TableCell>
                                <TableCell>{candidate.experience}</TableCell>
                                <TableCell>{candidate.status}</TableCell>
                                <TableCell>{candidate.match_score}</TableCell>

                                <TableCell>

                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(candidate)}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(candidate.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </Paper>

        </Container>
    );

}