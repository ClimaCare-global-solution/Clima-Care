import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"

export default function ProfileLoading() {
  return (
    <PageContainer background="default">
      <SectionContainer className="py-8">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile card skeleton */}
              <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="bg-gray-200 h-24"></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact info skeleton */}
              <div className="bg-white rounded-lg shadow border p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats skeleton */}
              <div className="bg-white rounded-lg shadow border p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow border p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
