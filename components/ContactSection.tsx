import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

export default function ContactSection() {
  return (
    <section className="hand-section">
      <Container>
        <SectionTitle title="Contact details." subtitle="say hello" />

        <form className="grid max-w-xl gap-4">
          <input className="sketch-input" placeholder="your name" />
          <input className="sketch-input" placeholder="your email" />
          <textarea className="sketch-input min-h-32" placeholder="your message" />
          <button
            type="submit"
            className="ink-frame w-fit bg-[#181614] px-6 py-3 text-xl font-bold text-[#fffaf0]"
          >
            send message
          </button>
        </form>
      </Container>
    </section>
  );
}
