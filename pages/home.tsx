import React, { useEffect, useState } from "react";
import LandingLayout from "../layouts/LandingLayout";
import styles from "../styles/pages/landing.module.scss";
import Image from "next/image";
import { Service } from "../types/services";

const Landing = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/dentist/dentist-service");
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      setServices(data); // Assuming the response directly contains an array of services
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const renderContent = () => {
    return (
      <div className={styles.main}>
        <div>
          <Image
            className={styles.logo}
            src="/logo.png"
            alt="logo"
            width={450}
            height={0}
          />
        </div>
        <div className={styles.mainContainer}>
          <p>
            The DentalFix Dental Clinic is a family-owned and newly founded
            business in the fourth week of January 2023. It is established
            through thorough planning, hard work, and with the help of Dr.
            Sheela Mae De Jesus’ parents. Considering the factors such as the
            population in the area, central business district, and the location
            of their laboratory, they have decided to establish and rent a space
            for their dental clinic in a building near the University of Baguio
            where Dr. De Jesus graduated Doctor of Medicine in Dentistry (DMD)
            last 2019.
          </p>
          <br />
          <h2>Operating Hours</h2>
          <div className={styles.mainOperating}>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday - Sunday: Closed</p>
          </div>
          {/* services */}
          <div className={styles.servicesContainer}>
            {loading && <p>Loading...</p>}
            {!loading &&
              services.map((service) => (
                <div key={service._id} className={styles.serviceCard}>
                  <div className={styles.serviceCardLabel}>
                    <span>{service.name}</span>
                    <span>P{parseFloat(service.price).toFixed(2)}</span>
                  </div>
                  <span>{service.description}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return <LandingLayout>{renderContent()}</LandingLayout>;
};

export default Landing;
