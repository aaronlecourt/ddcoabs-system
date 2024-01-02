import connectMongo from "../../../../utils/connectMongo";
import DentistService from "../../../../models/DentistService";
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
        const { search, filter } = query;

        let filterCondition: { $or: ({ isArchived: boolean } | { isArchived: null })[] } = {
          $or: [{ isArchived: false }, { isArchived: null }],
        };

        if (search) {
          // Adjust these conditions based on your schema fields
          filterCondition = {
            ...filterCondition,
            $or: [
              { name: { $regex: search, $options: "i" } },
            ],
          };
        }

        let result = [];

        if (filter) {
          switch (filter) {
            case "Oldest to Latest":
              result = await DentistService.find(filterCondition).sort({
                createdAt: 1,
              });
              break;
            case "Latest to Oldest":
              result = await DentistService.find(filterCondition).sort({
                createdAt: -1,
              });
              break;
            case "Alphabetical (A-Z)":
              result = await DentistService.find(filterCondition).sort({
                name: 1,
              });
              break;
            case "Alphabetical (Z-A)":
              result = await DentistService.find(filterCondition).sort({
                name: -1,
              });
              break;
            case "Price (Lowest to Highest)":
              result = await DentistService.find(filterCondition).sort({
                price: 1,
              });
              break;
            case "Price (Highest to Lowest)":
              result = await DentistService.find(filterCondition).sort({
                price: -1,
              });
              break;
            default:
              break;
          }
        } else {
          result = await DentistService.find(filterCondition);
        }

        res.status(200).json(result);
        break;

      case "POST":
        try {
          const dentistServiceCreated = await DentistService.insertMany(body);
          res.status(200).json(dentistServiceCreated);
        } catch (error) {
          console.error("Error creating dentist service:", error);
          res.status(500).json({ error: "Failed to create dentist service" });
        }
        break;

      case "PUT":
        try {
          const { _id, ...updateData } = body;
          if (!_id) {
            res.status(400).json({ error: "ID is required for update" });
            return;
          }
          const service = await DentistService.findByIdAndUpdate(
            _id,
            updateData,
            {
              new: true,
            }
          );
          res.status(200).json(service);
        } catch (error) {
          console.error("Error updating dentist service:", error);
          res.status(500).json({ error: "Failed to update dentist service" });
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
