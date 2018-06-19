def generateError(msg, code):
    res = {}
    res['error'] = {
        "code": code,
        "message": msg
    }
    return res
