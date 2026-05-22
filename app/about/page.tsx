import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <section>
          <h1>About Me</h1>
          <p>
            I am a software engineer who loves building scalable applications,
            exploring new places, trying new things, and learning from real
            experiences.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}