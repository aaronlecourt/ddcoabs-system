import connectMongo from "../../../../utils/connectMongo";
import Appointment from "../../../../models/Appointment";
import type { NextApiRequest, NextApiResponse } from "next";
import type { IAppointment } from "../../../interfaces/IAppointment";
import APPOINTMENT_STATUS from "../../../../constants/appointmentStatus";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();

    const { query, method, body } = req;

    switch (method) {
      case "GET":
  try {
    await connectMongo();

    const { status = "All", search } = query;

    let appointmentQuery = {};

    if (status === "Today") {
      const today = new Date(); // Get today's date
      appointmentQuery = {
        date: {
          $gte: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ),
          $lt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
          ),
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
          // For instance: { 'fieldToSearch': { $regex: search, $options: 'i' } },
        ],
      };

      appointmentQuery = status === "All"
        ? { ...searchQuery } // For "All," apply search query directly
        : { ...appointmentQuery, ...searchQuery }; // Merge search with existing query
    }

    const appointments = await Appointment.find(appointmentQuery);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
  break;


      case "POST":
        // validate req body
        if (!["AM", "PM"].includes(body.time)) {
          res.status(417).json("Time should be AM or PM only");
        }

        const appointmentCreated = await Appointment.create(body);
        res.status(200).json(appointmentCreated);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}
