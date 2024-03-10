import { TestForm } from "@/forms/test-form";
function App() {
  return (
    <main className="w-screen h-screen bg-gray-100 flex justify-center items-center flex-col gap-4">
      <h1 className="text-3xl font-bold">Form Component</h1>
      <div className="w-1/2 h-1/2 bg-white shadow-lg rounded-lg p-4">
        <TestForm />
      </div>
    </main>
  );
}

export default App;
