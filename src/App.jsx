// App.jsx
import ExpenseTracker from './components/ExpenseTracker'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-blue-600">ExpenseWise</h1>
        </div>
      </nav>
      <main className="py-8">
        <ExpenseTracker />
      </main>
    </div>
  )
}

export default App