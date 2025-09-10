import React from "react";
import { developer, projects } from "../../data/developerData"; // your JSON data
import { FaGithub, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const About = () => {
    return (
        <div className="px-6 md:px-20 py-10 max-w-7xl mx-auto space-y-16">
            <Helmet>
                <title>About ExploreBD | Discover Bangladesh</title>
                <meta
                    name="description"
                    content="Learn about ExploreBD, your ultimate travel guide to Bangladesh's top destinations."
                />
                <meta property="og:title" content="About ExploreBD | Discover Bangladesh" />
                <meta
                    property="og:description"
                    content="Discover our mission, team, and commitment to helping you explore Bangladesh."
                />
                <meta property="og:image" content="https://i.ibb.co/about-banner.jpg" />
            </Helmet>
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-primary">About the Developer</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
                    Meet the person behind ExploreBD and other amazing projects
                </p>
                <img
                    src={developer.image}
                    alt={developer.name}
                    className="mx-auto w-40 h-40 rounded-full object-cover mt-4 shadow-lg"
                />
            </section>

            {/* Developer Bio */}
            <section className="text-center space-y-3">
                <h2 className="text-2xl font-semibold">{developer.name}</h2>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                    {developer.bio}
                </p>
                {/* Social Links */}
                <div className="flex justify-center gap-6 mt-3 text-2xl text-primary">
                    {developer.socialLinks.github && (
                        <a href={developer.socialLinks.github} target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                    )}
                    {developer.socialLinks.linkedin && (
                        <a href={developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                    )}
                    {developer.socialLinks.WhatsApp && (
                        <a href={developer.socialLinks.WhatsApp} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp />
                        </a>
                    )}
                </div>
            </section>

            {/* Projects Section */}
            <section>
                <h2 className="text-3xl font-bold text-center mb-8 text-primary">Other Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                            <div className="flex gap-4">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <FaGithub /> GitHub
                                    </a>
                                )}
                                {project.live && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="text-center mt-16">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Want to explore trips and adventures? Check out ExploreBD!
                </p>
                <a
                    href="/allTrips"
                    className="btn btn-primary px-6 py-3 rounded-full"
                >
                    Explore Trips
                </a>
            </section>
        </div>
    );
};

export default About;
