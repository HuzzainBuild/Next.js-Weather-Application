"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  dayImg,
  dayligthImg,
  humidityImg,
  nightImg,
  rainImg,
  windImg,
} from "@/public/images";

export default function Home() {
  const [country, setCountry] = useState<string>("");
  const [coutryData, setCoutryData] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchCountryData = async () => {
      const apiKey = "fababb210586747eba13280a39250df8";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=9.0820&lon=8.6753&appid=${apiKey}`;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
          },
          (error) => {
            console.error(`Error getting location: ${error.message}`);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
      }

      try {
        const response = await fetch(url);
        const data = await response.json();

        setCoutryData(data);
      } catch (error) {
        alert("Unable to get Country");
      }
    };

    fetchCountryData();
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountry(value);
  };

  const formattedTime = () => {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSearchCountry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const apiKey = "fababb210586747eba13280a39250df8";
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=5&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const lat = data[0]?.lat;
      const lon = data[0]?.lon;

      const apiKey = "fababb210586747eba13280a39250df8";
      const uri = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      const res = await fetch(uri);
      const result = await res.json();
      console.log(result);
      setCoutryData(result);
    } catch (error) {
      alert("Unable to get Country");
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg">
      <main className="wrapper py-6 px-9 max-sm:px-6 rounded-lg w-[90%] md:w-[40%] lg:w-[35%]">
        <div className="flex justify-between items-center my-3">
          <p className="font-medium text-white">Current Weather</p>
          <small className="font-medium text-white py-1 px-2 rounded-md glass">
            {formattedTime()}
          </small>
        </div>

        <form action="" onSubmit={handleSearchCountry}>
          <div className="flex justify-between items-center gap-3">
            <input
              type="text"
              className="bg-white py-3 px-3 text-bold w-full rounded-full focus:shadow-lg outline-gray-950 font-medium border-0"
              placeholder="Enter City Name"
              value={country}
              onChange={handleCountryChange}
            />

            <div>
              <button
                type="submit"
                className="py-3 px-3 rounded-full flex justify-center items-center bg-white text-gray-950 hover:shadow-xl hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>

        <div className="flex gap-3 items-center mt-4 glass py-3 px-5 rounded-md">
          <div>
            <Image
              src={dayligthImg}
              priority={false}
              alt="image-1"
              className="w-[100px]"
            />
          </div>
          <div>
            <h1 className="text-5xl font-medium text-white">
              {coutryData
                ? (Number(coutryData?.main?.temp) - 273.25).toFixed(2)
                : 0}
              <span>
                <sup>o</sup>C
              </span>
            </h1>
            <p className="text-2xl font-medium text-white">
              {coutryData ? coutryData?.name : "City Name"}
            </p>
          </div>
        </div>

        <div className="my-6">
          <div className="grid max-sm:grid-cols-2 grid-cols-3 gap-2 my-2">
            <div className="py-3 px-3 rounded-md glass">
              <p className="text-white text-sm">Hummidity</p>
              <h1 className="text-white font-medium">
                {coutryData ? coutryData?.main?.humidity : 0}%
              </h1>
            </div>

            <div className="py-3 px-3 rounded-md glass">
              <p className="text-white text-sm">Visibility</p>
              <h1 className="text-white font-medium">
                {coutryData ? coutryData?.visibility : 0}km
              </h1>
            </div>

            <div className="py-3 px-3 rounded-md glass">
              <p className="text-white text-sm">Pressure</p>
              <h1 className="text-white font-medium">
                {coutryData ? coutryData?.main?.pressure : 0}mb
              </h1>
            </div>

            <div className="py-3 px-3 rounded-md glass">
              <p className="text-white text-sm">Wind Speed</p>
              <h1 className="text-white font-medium">
                {coutryData ? coutryData?.wind?.speed : 0}km/h
              </h1>
            </div>

            <div className="py-3 px-3 rounded-md glass">
              <p className="text-white text-sm">Wind Deg</p>
              <h1 className="text-white font-medium">
                {coutryData ? coutryData?.wind?.deg : 0}
                <span>
                  <sup>o</sup>C
                </span>
              </h1>
            </div>

            <div className="py-3 px-3 rounded-md glass">
              <p className="text-white text-sm">Wind Gust</p>
              <h1 className="text-white font-medium">
                {coutryData ? coutryData?.wind?.gust : 0}km
              </h1>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
