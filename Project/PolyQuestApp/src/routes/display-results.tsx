import { createFileRoute } from "@tanstack/react-router"
import { Progress, Card, Text, Button, Badge } from "@mantine/core"

export const Route = createFileRoute("/display-results")({
  component: DisplayResultsPage
})
const sectors = [
  { name: "Sales & Marketing", value: 100 },
  { name: "Education", value: 95 },
  { name: "Healthcare", value: 90 },
  { name: "Agriculture & Natural Resources", value: 80 },
  { name: "Technology", value: 75 },
  { name: "Hospitality & Tourism", value: 70 },
  { name: "Manufacturing", value: 65 },
  { name: "Public Service", value: 60 },
  { name: "Engineering", value: 55 },
  { name: "Construction", value: 50 },
  { name: "Business", value: 45 },
  { name: "Creative Arts", value: 40 }
]

const courses = [
  { name: "Aerospace Engineering", institute: "Ngee Ann Polytechnic" },
  { name: "Biomedical Engineering", institute: "Ngee Ann Polytechnic" },
  { name: "Computer Science", institute: "Ngee Ann Polytechnic" },
  { name: "Mechanical Engineering", institute: "Ngee Ann Polytechnic" }
]

function DisplayResultsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-4"> Results</h1>
      <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
        <div className="mb-8">
          <p className="text-lg font-semibold mb-4">
            Here are the sectors you are likely suited for
          </p>
          <div className="space-y-2">
            {sectors.map((sector) => (
              <div key={sector.name}>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  {sector.name}
                </p>
                <Progress
                  value={sector.value}
                  color="rgb(63 62 254)"
                  size="lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold mb-4">
            Here are the courses we recommend
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course, index) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                className="hover:shadow-lg transition-shadow duration-300">
                <Badge color="blue" variant="filled">
                  {course.institute}
                </Badge>
                <Text className="mt-2 mb-2">{course.name}</Text>
                <Button
                  variant="subtle"
                  color="blue"
                  className="w-full mt-2"
                  component="a"
                  href="#"
                  size="sm">
                  View more →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
