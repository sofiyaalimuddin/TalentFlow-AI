import { useEffect, useState } from "react";

import {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
} from "../services/jobService";

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

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [editingId, setEditingId] = useState(null);

    async function loadJobs() {
        try {
            const data = await getJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
        }
    }

const [job, setJob] = useState({
    title: "",
    department: "",
    description: "",
});

    useEffect(() => {
        loadJobs();
    }, []);

    //Handle submit function to create a new job
async function handleSubmit() {
    try {

        if (editingId) {

            await updateJob(editingId, job);

            setEditingId(null);

        } else {

            await createJob(job);

        }

        setJob({
            title: "",
            department: "",
            description: "",
        });

        loadJobs();

    } catch (error) {

        console.error(error);

    }
}
  //Handle delete function to delete a job
async function handleDelete(id) {

    try {

        await deleteJob(id);

        loadJobs();

    } catch (error) {

        console.error(error);

    }

}
  // handle edit function to edit a job
  function handleEdit(job) {

    setJob({
        title: job.title,
        department: job.department,
        description: job.description,
    });

    setEditingId(job.id);

}
    return (
        <Container sx={{ mt: 4 }}>

            <Typography
                variant="h4"
                gutterBottom
            >
                Jobs
            </Typography>

<Stack spacing={2} sx={{ mb: 3 }}>

    <TextField
        label="Job Title"
        value={job.title}
        onChange={(e) =>
            setJob({
                ...job,
                title: e.target.value,
            })
        }
    />

    <TextField
        label="Department"
        value={job.department}
        onChange={(e) =>
            setJob({
                ...job,
                department: e.target.value,
            })
        }
    />

    <TextField
        label="Description"
        multiline
        rows={4}
        value={job.description}
        onChange={(e) =>
            setJob({
                ...job,
                description: e.target.value,
            })
        }
    />

    <Button
    variant="contained"
    onClick={handleSubmit}
>
    {editingId ? "Update Job" : "Add Job"}
    </Button>

</Stack>
            <Paper>

                <Table>

                    <TableHead>

                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {jobs.map((job) => (

                            <TableRow key={job.id}>

                                <TableCell>
                                    {job.title}
                                </TableCell>

                                <TableCell>
                                    {job.department}
                                </TableCell>

                                <TableCell>
                                    {job.description}
                                </TableCell>

                                  <IconButton
                                    onClick={() => handleEdit(job)}
                                    color="primary">
                                    <EditIcon />
                                  </IconButton>

                                <TableCell>

                                  <IconButton
                                        color="error"
                                        onClick={() => handleDelete(job.id)}
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