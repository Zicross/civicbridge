import AddressLookupForm from "@/components/AddressLookupForm";
import RepresentativeList from "@/components/RepresentativeList";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import MessageForm from "@/components/MessageForm";

export default function IntakePage() {
  return (
    <section style={{ padding: "2rem" }}>
      <h2>Submit Feedback</h2>
      <AddressLookupForm />
      <RepresentativeList />
      <ConsentCheckbox />
      <MessageForm />
    </section>
  );
}
