import React, { useEffect, useState } from 'react';

const ActivityDetails = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/getActivity');
                const data = await response.json();

                const updatedData = data.map(activity => {
                    if (activity.status === 'None') {
                        const currentDate = new Date();
                        const deadlineDate = new Date(activity.date);
                        const status = deadlineDate > currentDate ? 'In Progress' : 'Pending';
                        return { ...activity, status };
                    }
                    return activity;
                });


                setActivities(updatedData);
            } catch (error) {
                console.error('Error fetching Activities', error);
            }
        };
        fetchActivities();
    }, []);

    const handleActionChange = (index, value) => {
        console.log(activities)
        const updatedActivities = [...activities];
        updatedActivities[index].status = value;

        const currentDate = new Date();
        const deadlineDate = new Date(updatedActivities[index].date);

        if (deadlineDate > currentDate) {
            updatedActivities[index].status = 'In Progress';
        } else {
            updatedActivities[index].status = 'Pending';
        }

        setActivities(updatedActivities);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'bg-primary rounded text-white';
            case 'Pending':
                return 'bg-warning rounded text-white';
            case 'Completed':
                return 'bg-success rounded text-white';
            case 'Cancelled':
                return 'bg-danger rounded text-white';
            default:
                return '';
        }
    };

    const handleStatusChange = async (index, value) => {
        const updatedActivities = [...activities];
        updatedActivities[index].status = value;
        setActivities(updatedActivities);

        // Disable the select element after updating the status
        const selectElement = document.getElementById(`statusSelect${index}`);
        selectElement.disabled = true;

        try {
            await fetch('http://localhost:4000/api/updateStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: updatedActivities[index]._id,
                    status: value,
                }),
            });
            console.log(updatedActivities[index]._id)
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };




    return (
        <div className="container table-responsive">
            <h1 className="my-3">All Activities</h1>
            <table className="table table-light mt-3 " id="Approved-Table">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{activity.name}</td>
                            <td>{activity.date}</td>
                            <td>
                                <span className={`badge ${getStatusColor(activity.status)}`}>
                                    {activity.status}
                                </span>
                            </td>
                            <td>
                                {activity.status !== "Completed" && activity.status !== "Cancelled" && (
                                    <select
                                        id={`statusSelect${index}`}
                                        className="form-select"
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                    >
                                        <option selected value="None">Update the Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                )}
                                {/* {activity.status !== 'None' && (
                                    <span>{activity.status}</span>
                                )} */}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityDetails;
