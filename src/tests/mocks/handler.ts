import { http, HttpResponse } from 'msw'

const employees = [
    {
        id: '1',
        name: 'John Doe',
        mail: 'john@example.com',
        ph_no: '9876543210',
        country: 'USA',
        state: 'New York',
        city: 'jersey city',
    },
    {
        id: '2',
        name: 'Jane Smith',
        mail: 'jane@example.com',
        ph_no: '9876543211',
        country: 'England',
        state: 'London',
        city: 'camden town',
    }
]

const countries = [
    {
        id: '1',
        name: 'India',
    },
    {
        id: '2',
        name: 'USA',
    },
    {
        id: '3',
        name: 'UK',
    },
]

export const handler = [
    http.get('https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee', () => {
        return HttpResponse.json(employees)
    }),

    http.get('https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee/:id', ({ params }) => {
        const employee = employees.find((emp) => emp.id === params.id)
        if (!employee)
            return new HttpResponse(null, { status: 404 })
        return HttpResponse.json(employee)
    }),

    http.post('https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee', async ({ request }) => {
        const data = await request.json() as Record<string, unknown>
        return HttpResponse.json(
            {
                id: '3',
                ...data 
            },
            {
                status: 201
            }
        )
    }),

    http.put('https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee/:id', async ({ params, request }) => {
        const data = await request.json() as Record<string, unknown>

        return HttpResponse.json({ id: params.id, ...data })
    }),

    http.delete('https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee/:id', ({ params }) => {
        return HttpResponse.json({ id: params.id })
    }),

    http.get('https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country', () => {
        return HttpResponse.json(countries)
    })
]