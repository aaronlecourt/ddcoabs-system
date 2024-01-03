import connectMongo from "../../../../utils/connectMongo";
import DentistAppointments from "../../../../models/Appointment";
import User from "../../../../models/User";
import type { NextApiRequest, NextApiResponse } from "next";

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
          // const dentistAppointments = await DentistAppointments.find()
          //   .populate("patientId") // Populate the patientId field
          //   .exec();

            const dentistAppointments = await DentistAppointments.find().exec();

            const populatedAppointments = await Promise.all(
              dentistAppointments.map(async (appointment) => {
                try {
                  let resolvedContactNumber = "-";
  
                  // Get contact number from User model based on patientId
                  const user = await User.findById(appointment.patientId);
  
                  if (user) {
                    if (user.isWalkIn && user.patientName) {
                      resolvedContactNumber = `Contact number based on name: ${user.patientName}`;
                    } else {
                      resolvedContactNumber = user.contactNumber || "Contact number not available";
                    }
                  }
  
                  // Get contact number from Appointment model based on patientName
                  const appointmentByPatientName = await DentistAppointments.findOne({
                    patientName: appointment.patientName,
                  });
  
                  if (appointmentByPatientName && appointmentByPatientName.contactNumber) {
                    resolvedContactNumber = appointmentByPatientName.contactNumber;
                  }
  
                  return {
                    ...appointment.toObject(),
                    contactNumber: resolvedContactNumber,
                  };
                } catch (error) {
                  console.error("Error fetching user/appointment:", error);
                  return {
                    ...appointment.toObject(),
                    contactNumber: "Contact number not available",
                  };
                }
              })
            );

          res.status(200).json(populatedAppointments);
        } catch (error) {
          console.error("Error fetching dentist appointments:", error);
          res.status(500).json({ error: "Failed to fetch dentist appointments" });
        }
        break;

      case "POST":
        try {
          const dentistAppointmentCreated = await DentistAppointments.insertMany(body);
          res.status(200).json(dentistAppointmentCreated);
        } catch (error) {
          console.error("Error creating dentist service:", error);
          res.status(500).json({ error: "Failed to create dentist service" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}