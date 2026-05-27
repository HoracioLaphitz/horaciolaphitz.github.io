"""
Profiling middleware using pyinstrument.

Activated by adding `?profile` to any request URL.
When active, returns an HTML flamechart / call-tree of the request.

Usage:
    curl http://localhost:8000/api/v1/projects?profile

Only activates when the `profile` query param is present, so it's safe
to leave enabled in production — no overhead on normal requests.
"""

from django.http import HttpResponse


class PyinstrumentMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'profile' not in request.GET:
            return self.get_response(request)

        from pyinstrument import Profiler

        profiler = Profiler(async_mode='disabled')
        profiler.start()
        self.get_response(request)
        profiler.stop()

        html = profiler.output_html()
        return HttpResponse(html)
