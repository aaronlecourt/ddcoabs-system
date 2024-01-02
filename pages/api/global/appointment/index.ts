import connectMongo from "../../../../utils/connectMongo";
import Appointment from "../../../../models/Appointment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function appointmentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();

    const { query, method, body } = req;

    switch (method) {
      case "GET":
        try {
          const { status = "All", search, sortBy } = query;

          let appointmentQuery = {};

          // Prepare the query based on status and search parameters
          if (status === "Today") {
            const today = new Date();
            appointmentQuery = {
              date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
              },
            };
          } else if (status !== "All") {
            appointmentQuery = { status };
          }

          if (search) {
            const searchQuery = {
              $or: [
                { patientName: { $regex: search, $options: "i" } },
                { dentistService: { $regex: search, $options: "i" } },
                // Add more fields here based on your Appointment model
              ],
            };

            appointmentQuery = status === "All"
              ? { ...searchQuery }
              : { ...appointmentQuery, ...searchQuery };
          }

          let appointments = await Appointment.find(appointmentQuery);

          // Apply sorting based on sortBy parameter
          if (sortBy) {
            switch (sortBy) {
              case "Oldest to Latest":
                appointments = appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
              case "Latest to Oldest":
                appointments = appointments.sort((a, b) => new Date(b.date).getTime()- new Date(a.date).getTime());
                break;
              case "Alphabetical (A-Z)":
                appointments = appointments.sort((a, b) => a.dentistService.localeCompare(b.dentistService));
                break;
              case "Alphabetical (Z-A)":
                appointments = appointments.sort((a, b) => b.dentistService.localeCompare(a.dentistService));
                break;
              case "Pending First":
                appointments = appointments.sort((a, b) => {
                  if (a.status === "Pending" && b.status !== "Pending") {
                    return -1; // "Pending" appointments come first
                  } else if (a.status !== "Pending" && b.status === "Pending") {
                    return 1; // "Pending" appointments come after other statuses
                  } else {
                    return 0; // Maintain the order for other statuses
                  }
                });
                break;
              // Add more cases for additional sorting criteria if needed
              default:
                break;
            }
          }

          res.status(200).json(appointments);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          res.status(500).json({ error: "Failed to fetch appointments" });
        }
        break;

      case "POST":
        // Validate req body
        if (!["AM", "PM"].includes(body.time)) {
          res.status(417).json("Time should be AM or PM only");
        }

        const appointmentCreated = await Appointment.create(body);
        res.status(200).json(appointmentCreated);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
